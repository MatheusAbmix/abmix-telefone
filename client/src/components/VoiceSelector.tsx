import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceSelectorProps {
  value: 'masc' | 'fem' | 'natural';
  onChange: (value: 'masc' | 'fem' | 'natural') => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Tipo de Voz
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" data-testid="select-voice-type">
          <SelectValue placeholder="Selecione o tipo de voz" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masc" data-testid="voice-masc">
            Masculina
          </SelectItem>
          <SelectItem value="fem" data-testid="voice-fem">
            Feminina
          </SelectItem>
          <SelectItem value="natural" data-testid="voice-natural">
            Natural
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}