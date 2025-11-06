import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mic, Volume2, Upload, Wand2, Settings2, Play, Download } from 'lucide-react';
import { api } from '@/services/api';

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
}

export function VoicesHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for voice configuration
  const [mascVoiceId, setMascVoiceId] = useState('pNInz6obpgDQGcFmaJgB');
  const [femVoiceId, setFemVoiceId] = useState('EXAVITQu4vr4xnSDxMaL');
  const [naturalVoiceId, setNaturalVoiceId] = useState('onwK4e9ZLuTAKqWW03F9');

  // State for voice testing
  const [testText, setTestText] = useState('Olá! Esta é uma amostra de como minha voz vai soar.');
  const [selectedVoiceForTest, setSelectedVoiceForTest] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // State for voice cloning
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [cloneTargetVoice, setCloneTargetVoice] = useState('');
  const [cloneName, setCloneName] = useState('');

  // State for audio effects
  const [effectFile, setEffectFile] = useState<File | null>(null);
  const [selectedEffect, setSelectedEffect] = useState('');

  // State for advanced settings
  const [stability, setStability] = useState(35);
  const [similarity, setSimilarity] = useState(95);
  const [style, setStyle] = useState(15);
  const [speakerBoost, setSpeakerBoost] = useState(true);
  const [model, setModel] = useState('eleven_multilingual_v2');

  // Fetch all voices
  const { data: allVoices = [] } = useQuery<Voice[]>({
    queryKey: ['/api/voices'],
    queryFn: async () => {
      const response = await fetch('/api/voices');
      if (!response.ok) throw new Error('Failed to fetch voices');
      return response.json();
    }
  });

  // Fetch current settings
  const { data: serverSettings } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Update local state from server settings
  useEffect(() => {
    if (serverSettings) {
      setMascVoiceId(serverSettings.VOZ_MASC_ID || mascVoiceId);
      setFemVoiceId(serverSettings.VOZ_FEM_ID || femVoiceId);
      setNaturalVoiceId(serverSettings.VOZ_NATURAL_ID || naturalVoiceId);
    }
  }, [serverSettings]);

  // Save voice configuration
  const saveVoiceMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [data.key]: data.value })
      });
      if (!response.ok) throw new Error('Failed to save voice');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Voz salva",
        description: "Configuração atualizada com sucesso",
      });
    }
  });

  // Test voice
  const testVoiceMutation = useMutation({
    mutationFn: async (voiceId: string) => {
      const response = await fetch('/api/voices/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId,
          text: testText,
          voice_settings: {
            stability: stability / 100,
            similarity_boost: similarity / 100,
            style: style / 100,
            use_speaker_boost: speakerBoost
          },
          model_id: model
        })
      });
      if (!response.ok) throw new Error('Failed to test voice');
      return response.blob();
    },
    onSuccess: async (blob) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
      toast({
        title: "Reproduzindo voz",
        description: "Ouvindo amostra de voz",
      });
    }
  });

  // Clone voice mutation
  const cloneVoiceMutation = useMutation({
    mutationFn: async (data: { file: File; targetVoiceId: string; name: string }) => {
      const formData = new FormData();
      formData.append('audio', data.file);
      formData.append('targetVoiceId', data.targetVoiceId);
      formData.append('name', data.name);

      const response = await fetch('/api/voices/clone', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to clone voice');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voz clonada!",
        description: "Processamento concluído com sucesso",
      });
      setCloneFile(null);
      setCloneTargetVoice('');
      setCloneName('');
      queryClient.invalidateQueries({ queryKey: ['/api/voices'] });
    },
    onError: (error) => {
      toast({
        title: "Erro na clonagem",
        description: error instanceof Error ? error.message : "Falha ao processar",
        variant: "destructive",
      });
    }
  });

  // Audio effects mutation
  const applyEffectMutation = useMutation({
    mutationFn: async (data: { file: File; effect: string }) => {
      const formData = new FormData();
      formData.append('audio', data.file);
      formData.append('effect', data.effect);

      const response = await fetch('/api/audio/effects', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to apply effect');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processed-${effectFile?.name || 'audio.wav'}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Efeito aplicado",
        description: "Download do áudio processado iniciado",
      });
      setEffectFile(null);
      setSelectedEffect('');
    }
  });

  const handleSaveVoice = (type: 'masc' | 'fem' | 'natural', voiceId: string) => {
    const key = type === 'masc' ? 'VOZ_MASC_ID' : type === 'fem' ? 'VOZ_FEM_ID' : 'VOZ_NATURAL_ID';
    saveVoiceMutation.mutate({ key, value: voiceId });
  };

  const handleTestVoice = (voiceId: string) => {
    if (!testText.trim()) {
      toast({
        title: "Texto vazio",
        description: "Digite um texto para testar a voz",
        variant: "destructive",
      });
      return;
    }
    setSelectedVoiceForTest(voiceId);
    testVoiceMutation.mutate(voiceId);
  };

  const handleCloneVoice = () => {
    if (!cloneFile || !cloneTargetVoice || !cloneName.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    cloneVoiceMutation.mutate({ file: cloneFile, targetVoiceId: cloneTargetVoice, name: cloneName });
  };

  const handleApplyEffect = () => {
    if (!effectFile || !selectedEffect) {
      toast({
        title: "Dados incompletos",
        description: "Selecione um arquivo e um efeito",
        variant: "destructive",
      });
      return;
    }
    applyEffectMutation.mutate({ file: effectFile, effect: selectedEffect });
  };

  // Filter voices by gender
  const getVoicesByGender = (gender: string) => {
    return allVoices.filter(v => 
      v.labels?.gender?.toLowerCase() === gender.toLowerCase() ||
      v.labels?.use_case?.toLowerCase()?.includes(gender.toLowerCase())
    );
  };

  const masculineVoices = getVoicesByGender('male');
  const feminineVoices = getVoicesByGender('female');
  const allOtherVoices = allVoices.filter(v => 
    !masculineVoices.includes(v) && !feminineVoices.includes(v)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Vozes & TTS</h2>
        <p className="text-muted-foreground">
          Configure, teste e gerencie todas as vozes do sistema
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config" data-testid="tab-config">
            <Settings2 className="w-4 h-4 mr-2" />
            Configurar
          </TabsTrigger>
          <TabsTrigger value="library" data-testid="tab-library">
            <Volume2 className="w-4 h-4 mr-2" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="test" data-testid="tab-test">
            <Play className="w-4 h-4 mr-2" />
            Testar
          </TabsTrigger>
          <TabsTrigger value="clone" data-testid="tab-clone">
            <Wand2 className="w-4 h-4 mr-2" />
            Clonar
          </TabsTrigger>
          <TabsTrigger value="effects" data-testid="tab-effects">
            <Mic className="w-4 h-4 mr-2" />
            Efeitos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Configurar Vozes */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Voz Masculina */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-male text-blue-500"></i>
                  Voz Masculina
                </CardTitle>
                <CardDescription>Voz padrão para chamadas masculinas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={mascVoiceId} onValueChange={setMascVoiceId}>
                  <SelectTrigger data-testid="select-masc-voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {masculineVoices.map(voice => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleTestVoice(mascVoiceId)}
                    disabled={testVoiceMutation.isPending}
                    data-testid="test-masc-voice"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Testar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSaveVoice('masc', mascVoiceId)}
                    disabled={saveVoiceMutation.isPending}
                    data-testid="save-masc-voice"
                  >
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voz Feminina */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-female text-pink-500"></i>
                  Voz Feminina
                </CardTitle>
                <CardDescription>Voz padrão para chamadas femininas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={femVoiceId} onValueChange={setFemVoiceId}>
                  <SelectTrigger data-testid="select-fem-voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feminineVoices.map(voice => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleTestVoice(femVoiceId)}
                    disabled={testVoiceMutation.isPending}
                    data-testid="test-fem-voice"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Testar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSaveVoice('fem', femVoiceId)}
                    disabled={saveVoiceMutation.isPending}
                    data-testid="save-fem-voice"
                  >
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voz Natural */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-user text-gray-500"></i>
                  Voz Natural
                </CardTitle>
                <CardDescription>Voz neutra e clara</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={naturalVoiceId} onValueChange={setNaturalVoiceId}>
                  <SelectTrigger data-testid="select-natural-voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allOtherVoices.map(voice => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleTestVoice(naturalVoiceId)}
                    disabled={testVoiceMutation.isPending}
                    data-testid="test-natural-voice"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Testar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSaveVoice('natural', naturalVoiceId)}
                    disabled={saveVoiceMutation.isPending}
                    data-testid="save-natural-voice"
                  >
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Ajuste fino para melhorar a naturalidade da voz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Estabilidade: {stability}%</Label>
                  <Slider 
                    value={[stability]} 
                    onValueChange={(val) => setStability(val[0])}
                    max={100}
                    step={1}
                    data-testid="slider-stability"
                  />
                  <p className="text-xs text-muted-foreground">
                    Baixa = mais expressiva | Alta = mais consistente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Similaridade: {similarity}%</Label>
                  <Slider 
                    value={[similarity]} 
                    onValueChange={(val) => setSimilarity(val[0])}
                    max={100}
                    step={1}
                    data-testid="slider-similarity"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controla a fidelidade à voz original
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Estilo: {style}%</Label>
                  <Slider 
                    value={[style]} 
                    onValueChange={(val) => setStyle(val[0])}
                    max={100}
                    step={1}
                    data-testid="slider-style"
                  />
                  <p className="text-xs text-muted-foreground">
                    Intensidade da expressividade vocal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Modelo de IA</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger data-testid="select-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eleven_multilingual_v2">
                        Multilingual V2 (Recomendado)
                      </SelectItem>
                      <SelectItem value="eleven_turbo_v2_5">
                        Turbo V2.5 (Rápido)
                      </SelectItem>
                      <SelectItem value="eleven_flash_v2_5">
                        Flash V2.5 (Ultra-rápido)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="speaker-boost"
                  checked={speakerBoost}
                  onChange={(e) => setSpeakerBoost(e.target.checked)}
                  className="rounded border-gray-300"
                  data-testid="checkbox-speaker-boost"
                />
                <Label htmlFor="speaker-boost" className="cursor-pointer">
                  Ativar Speaker Boost (melhora clareza)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Biblioteca de Vozes */}
        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Vozes Disponíveis</CardTitle>
              <CardDescription>Clique para ouvir uma amostra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allVoices.map(voice => (
                  <Card key={voice.voice_id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{voice.name}</h4>
                          {voice.labels?.gender && (
                            <Badge variant="outline" className="mt-1">
                              {voice.labels.gender}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleTestVoice(voice.voice_id)}
                          disabled={testVoiceMutation.isPending && selectedVoiceForTest === voice.voice_id}
                          data-testid={`play-voice-${voice.voice_id}`}
                        >
                          {testVoiceMutation.isPending && selectedVoiceForTest === voice.voice_id ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Testar Voz */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teste de Voz Personalizado</CardTitle>
              <CardDescription>Digite um texto e ouça como vai soar em diferentes vozes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-text">Texto para testar</Label>
                <Textarea
                  id="test-text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Digite o texto que deseja ouvir..."
                  rows={4}
                  data-testid="textarea-test-text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleTestVoice(mascVoiceId)}
                  disabled={testVoiceMutation.isPending || !testText.trim()}
                  data-testid="test-btn-masc"
                >
                  <i className="fas fa-male mr-2"></i>
                  Testar Masculina
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestVoice(femVoiceId)}
                  disabled={testVoiceMutation.isPending || !testText.trim()}
                  data-testid="test-btn-fem"
                >
                  <i className="fas fa-female mr-2"></i>
                  Testar Feminina
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestVoice(naturalVoiceId)}
                  disabled={testVoiceMutation.isPending || !testText.trim()}
                  data-testid="test-btn-natural"
                >
                  <i className="fas fa-user mr-2"></i>
                  Testar Natural
                </Button>
              </div>

              {isPlaying && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm">Reproduzindo áudio...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Clonar Voz */}
        <TabsContent value="clone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clonagem de Voz</CardTitle>
              <CardDescription>
                Converta um áudio para a voz desejada (requer arquivo MP3, WAV ou similar)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clone-file">Arquivo de Áudio</Label>
                <Input
                  id="clone-file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setCloneFile(e.target.files?.[0] || null)}
                  data-testid="input-clone-file"
                />
                {cloneFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo: {cloneFile.name} ({(cloneFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clone-name">Nome da Voz Clonada</Label>
                <Input
                  id="clone-name"
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                  placeholder="Ex: Minha Voz Convertida"
                  data-testid="input-clone-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clone-target">Voz de Destino</Label>
                <Select value={cloneTargetVoice} onValueChange={setCloneTargetVoice}>
                  <SelectTrigger id="clone-target" data-testid="select-clone-target">
                    <SelectValue placeholder="Selecione a voz para converter" />
                  </SelectTrigger>
                  <SelectContent>
                    {allVoices.map(voice => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCloneVoice}
                disabled={cloneVoiceMutation.isPending || !cloneFile || !cloneTargetVoice || !cloneName.trim()}
                className="w-full"
                data-testid="btn-clone"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {cloneVoiceMutation.isPending ? 'Processando...' : 'Clonar Voz'}
              </Button>

              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <h4 className="font-semibold mb-2">💡 Como funciona:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Faça upload de um arquivo de áudio com a voz original</li>
                  <li>2. Escolha qual voz da biblioteca você quer usar</li>
                  <li>3. O sistema converte o áudio mantendo o conteúdo mas mudando a voz</li>
                  <li>4. O resultado será processado e ficará disponível para download</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Efeitos de Áudio */}
        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Efeitos de Áudio</CardTitle>
              <CardDescription>Aplique melhorias e correções em arquivos de áudio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="effect-file">Arquivo de Áudio</Label>
                <Input
                  id="effect-file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setEffectFile(e.target.files?.[0] || null)}
                  data-testid="input-effect-file"
                />
                {effectFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo: {effectFile.name} ({(effectFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="effect-type">Efeito</Label>
                <Select value={selectedEffect} onValueChange={setSelectedEffect}>
                  <SelectTrigger id="effect-type" data-testid="select-effect">
                    <SelectValue placeholder="Selecione o efeito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="denoise">Redução de Ruído</SelectItem>
                    <SelectItem value="equalize">Equalização</SelectItem>
                    <SelectItem value="amplify">Amplificação</SelectItem>
                    <SelectItem value="normalize">Normalização</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleApplyEffect}
                disabled={applyEffectMutation.isPending || !effectFile || !selectedEffect}
                className="w-full"
                data-testid="btn-apply-effect"
              >
                <Download className="w-4 h-4 mr-2" />
                {applyEffectMutation.isPending ? 'Processando...' : 'Aplicar Efeito'}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">Redução de Ruído</h4>
                    <p className="text-xs text-muted-foreground">
                      Remove ruídos de fundo e interferências
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">Equalização</h4>
                    <p className="text-xs text-muted-foreground">
                      Melhora a qualidade tonal do áudio
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">Amplificação</h4>
                    <p className="text-xs text-muted-foreground">
                      Aumenta o volume geral do áudio
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">Normalização</h4>
                    <p className="text-xs text-muted-foreground">
                      Ajusta níveis para volume consistente
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
