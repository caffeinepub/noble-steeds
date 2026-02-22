import { useState } from 'react';
import { Loader2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRecordMedicineDosage } from '@/hooks/useQueries';

interface MedicineDosageFormProps {
  horseId: bigint;
}

export function MedicineDosageForm({ horseId }: MedicineDosageFormProps) {
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const recordMedicineDosageMutation = useRecordMedicineDosage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicine.trim() || !dosage) return;

    const dosageBigInt = BigInt(Math.round(parseFloat(dosage)));
    
    await recordMedicineDosageMutation.mutateAsync({ 
      horseId, 
      medicine: medicine.trim(), 
      dosage: dosageBigInt,
      unit 
    });
    
    setMedicine('');
    setDosage('');
    setUnit('mg');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medicine">Medicine Name</Label>
        <Input
          id="medicine"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="e.g., Bute, Banamine"
          required
          disabled={recordMedicineDosageMutation.isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            type="number"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Amount"
            min="0"
            step="0.1"
            required
            disabled={recordMedicineDosageMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit} disabled={recordMedicineDosageMutation.isPending}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mg">mg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="cc">cc</SelectItem>
              <SelectItem value="tablets">tablets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={recordMedicineDosageMutation.isPending || !medicine.trim() || !dosage} className="w-full">
        {recordMedicineDosageMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recording Dosage...
          </>
        ) : (
          <>
            <Pill className="mr-2 h-4 w-4" />
            Record Dosage
          </>
        )}
      </Button>
    </form>
  );
}
