import * as sip from 'sip';
import { randomUUID } from 'crypto';

interface SIPCall {
  callId: string;
  toNumber: string;
  fromNumber: string;
  dialog?: any;
  status: 'initiating' | 'ringing' | 'answered' | 'ended';
  startTime: Date;
  endTime?: Date;
}

export class SIPService {
  private initialized: boolean = false;
  private activeCalls: Map<string, SIPCall> = new Map();
  private sipUsername: string;
  private sipPassword: string;
  private sipServer: string;
  private sipPort: number;
  private localIP: string;
  private fromNumber: string;

  constructor(
    sipUsername: string,
    sipPassword: string,
    sipServer: string,
    fromNumber: string,
    sipPort: number = 5060
  ) {
    this.sipUsername = sipUsername;
    this.sipPassword = sipPassword;
    this.sipServer = sipServer;
    this.sipPort = sipPort;
    this.fromNumber = fromNumber;
    this.localIP = '0.0.0.0'; // Will be set dynamically
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[SIP_SERVICE] Already initialized');
      return;
    }

    try {
      console.log('[SIP_SERVICE] Initializing SIP stack...');
      console.log(`[SIP_SERVICE] Server: ${this.sipServer}:${this.sipPort}`);
      console.log(`[SIP_SERVICE] Username: ${this.sipUsername}`);
      
      // Start SIP stack
      sip.start({
        publicAddress: this.localIP,
        port: this.sipPort + 1000, // Use different port for client
        tcp: false,
        logger: {
          send: (message: any) => {
            console.log('[SIP_SERVICE] SENT:', message);
          },
          recv: (message: any) => {
            console.log('[SIP_SERVICE] RECEIVED:', message);
            this.handleIncomingMessage(message);
          }
        }
      }, (request: any) => {
        this.handleIncomingRequest(request);
      });

      this.initialized = true;
      console.log('[SIP_SERVICE] ✅ SIP stack initialized successfully');
      
      // Register with server
      await this.register();
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Failed to initialize:', error);
      throw error;
    }
  }

  private async register(): Promise<void> {
    console.log('[SIP_SERVICE] Registering with server...');
    
    const callId = randomUUID();
    const tag = randomUUID();
    
    try {
      sip.send({
        method: 'REGISTER',
        uri: `sip:${this.sipServer}:${this.sipPort}`,
        headers: {
          to: { uri: `sip:${this.sipUsername}@${this.sipServer}` },
          from: { 
            uri: `sip:${this.sipUsername}@${this.sipServer}`,
            params: { tag }
          },
          'call-id': callId,
          cseq: { method: 'REGISTER', seq: 1 },
          contact: [{ uri: `sip:${this.sipUsername}@${this.localIP}:${this.sipPort + 1000}` }],
          expires: 3600
        }
      });
      
      console.log('[SIP_SERVICE] ✅ REGISTER sent');
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Registration failed:', error);
    }
  }

  async makeCall(toNumber: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const callId = randomUUID();
    const tag = randomUUID();
    const branch = `z9hG4bK${randomUUID()}`;
    
    // Clean phone number (remove non-digits)
    const cleanNumber = toNumber.replace(/[^\d]/g, '');
    
    const call: SIPCall = {
      callId,
      toNumber: cleanNumber,
      fromNumber: this.fromNumber,
      status: 'initiating',
      startTime: new Date()
    };
    
    this.activeCalls.set(callId, call);
    
    console.log('[SIP_SERVICE] 📞 Making call...');
    console.log(`[SIP_SERVICE]   From: ${this.fromNumber} (${this.sipUsername})`);
    console.log(`[SIP_SERVICE]   To: ${cleanNumber}`);
    console.log(`[SIP_SERVICE]   Call-ID: ${callId}`);
    
    // Create minimal SDP for audio-only call
    const sdp = this.createSDP();
    
    try {
      sip.send({
        method: 'INVITE',
        uri: `sip:${cleanNumber}@${this.sipServer}:${this.sipPort}`,
        headers: {
          to: { uri: `sip:${cleanNumber}@${this.sipServer}` },
          from: { 
            uri: `sip:${this.sipUsername}@${this.sipServer}`,
            params: { tag }
          },
          'call-id': callId,
          cseq: { method: 'INVITE', seq: 1 },
          contact: [{ uri: `sip:${this.sipUsername}@${this.localIP}:${this.sipPort + 1000}` }],
          'content-type': 'application/sdp',
          via: [{
            version: '2.0',
            protocol: 'UDP',
            host: this.localIP,
            port: this.sipPort + 1000,
            params: { branch }
          }]
        },
        content: sdp
      });
      
      call.status = 'ringing';
      console.log('[SIP_SERVICE] ✅ INVITE sent');
      return callId;
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Failed to send INVITE:', error);
      call.status = 'ended';
      call.endTime = new Date();
      throw error;
    }
  }

  async hangup(callId: string): Promise<boolean> {
    const call = this.activeCalls.get(callId);
    if (!call) {
      console.warn(`[SIP_SERVICE] Call ${callId} not found`);
      return false;
    }

    console.log(`[SIP_SERVICE] 📴 Hanging up call ${callId}`);
    
    try {
      if (call.dialog) {
        // Send BYE if dialog established
        sip.send({
          method: 'BYE',
          uri: call.dialog.remote.uri,
          headers: {
            to: call.dialog.remote,
            from: call.dialog.local,
            'call-id': callId,
            cseq: { method: 'BYE', seq: (call.dialog.cseq || 1) + 1 }
          }
        });
      } else {
        // Send CANCEL if call not yet established
        sip.send({
          method: 'CANCEL',
          uri: `sip:${call.toNumber}@${this.sipServer}:${this.sipPort}`,
          headers: {
            to: { uri: `sip:${call.toNumber}@${this.sipServer}` },
            from: { uri: `sip:${this.sipUsername}@${this.sipServer}` },
            'call-id': callId,
            cseq: { method: 'CANCEL', seq: 1 }
          }
        });
      }
      
      call.status = 'ended';
      call.endTime = new Date();
      console.log('[SIP_SERVICE] ✅ BYE/CANCEL sent');
      return true;
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Failed to hangup:', error);
      return false;
    }
  }

  async sendDTMF(callId: string, digits: string): Promise<boolean> {
    const call = this.activeCalls.get(callId);
    if (!call || !call.dialog) {
      console.warn(`[SIP_SERVICE] Call ${callId} not active`);
      return false;
    }

    console.log(`[SIP_SERVICE] 🔢 Sending DTMF: ${digits}`);
    
    try {
      sip.send({
        method: 'INFO',
        uri: call.dialog.remote.uri,
        headers: {
          to: call.dialog.remote,
          from: call.dialog.local,
          'call-id': callId,
          cseq: { method: 'INFO', seq: (call.dialog.cseq || 1) + 1 },
          'content-type': 'application/dtmf-relay'
        },
        content: `Signal=${digits}\r\nDuration=100`
      });
      
      console.log('[SIP_SERVICE] ✅ DTMF sent');
      return true;
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Failed to send DTMF:', error);
      return false;
    }
  }

  getCallStatus(callId: string): SIPCall | undefined {
    return this.activeCalls.get(callId);
  }

  getAllCalls(): SIPCall[] {
    return Array.from(this.activeCalls.values());
  }

  private handleIncomingMessage(message: any): void {
    // Handle responses (200 OK, 180 Ringing, etc)
    if (message.status) {
      const callId = message.headers['call-id'];
      const call = this.activeCalls.get(callId);
      
      if (!call) return;

      switch (message.status) {
        case 100:
          console.log(`[SIP_SERVICE] 📞 Call ${callId}: Trying...`);
          break;
        case 180:
        case 183:
          console.log(`[SIP_SERVICE] 📞 Call ${callId}: Ringing...`);
          call.status = 'ringing';
          break;
        case 200:
          if (message.headers.cseq.method === 'INVITE') {
            console.log(`[SIP_SERVICE] ✅ Call ${callId}: Answered!`);
            call.status = 'answered';
            // Send ACK
            this.sendAck(call, message);
          }
          break;
        case 486:
          console.log(`[SIP_SERVICE] 📵 Call ${callId}: Busy`);
          call.status = 'ended';
          call.endTime = new Date();
          break;
        case 487:
          console.log(`[SIP_SERVICE] 📴 Call ${callId}: Cancelled`);
          call.status = 'ended';
          call.endTime = new Date();
          break;
        default:
          if (message.status >= 400) {
            console.log(`[SIP_SERVICE] ❌ Call ${callId}: Error ${message.status}`);
            call.status = 'ended';
            call.endTime = new Date();
          }
      }
    }
  }

  private handleIncomingRequest(request: any): void {
    console.log(`[SIP_SERVICE] Incoming request: ${request.method}`);
    
    // Handle incoming calls, BYE, etc
    if (request.method === 'BYE') {
      const callId = request.headers['call-id'];
      const call = this.activeCalls.get(callId);
      
      if (call) {
        console.log(`[SIP_SERVICE] 📴 Remote party hung up call ${callId}`);
        call.status = 'ended';
        call.endTime = new Date();
      }
      
      // Send 200 OK
      sip.send({
        method: 'OK',
        status: 200,
        reason: 'OK',
        headers: request.headers
      });
    }
  }

  private sendAck(call: SIPCall, inviteResponse: any): void {
    try {
      sip.send({
        method: 'ACK',
        uri: `sip:${call.toNumber}@${this.sipServer}:${this.sipPort}`,
        headers: {
          to: inviteResponse.headers.to,
          from: inviteResponse.headers.from,
          'call-id': call.callId,
          cseq: { method: 'ACK', seq: inviteResponse.headers.cseq.seq },
          via: inviteResponse.headers.via
        }
      });
      
      // Store dialog info
      call.dialog = {
        local: inviteResponse.headers.from,
        remote: inviteResponse.headers.to,
        cseq: inviteResponse.headers.cseq.seq
      };
      
      console.log('[SIP_SERVICE] ✅ ACK sent');
    } catch (error) {
      console.error('[SIP_SERVICE] ❌ Failed to send ACK:', error);
    }
  }

  private createSDP(): string {
    const sessionId = Date.now();
    const version = 1;
    
    return [
      `v=0`,
      `o=- ${sessionId} ${version} IN IP4 ${this.localIP}`,
      `s=Abmix Call`,
      `c=IN IP4 ${this.localIP}`,
      `t=0 0`,
      `m=audio 8000 RTP/AVP 0 8 101`,
      `a=rtpmap:0 PCMU/8000`,
      `a=rtpmap:8 PCMA/8000`,
      `a=rtpmap:101 telephone-event/8000`,
      `a=sendrecv`
    ].join('\r\n') + '\r\n';
  }

  async shutdown(): Promise<void> {
    console.log('[SIP_SERVICE] Shutting down...');
    
    // Hangup all active calls
    for (const callId of this.activeCalls.keys()) {
      await this.hangup(callId);
    }
    
    sip.stop();
    this.initialized = false;
    console.log('[SIP_SERVICE] ✅ Shutdown complete');
  }
}
