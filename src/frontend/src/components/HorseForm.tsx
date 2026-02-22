import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddHorse } from '@/hooks/useQueries';
import { ExternalBlob } from '@/backend';

interface HorseFormProps {
  onSuccess?: () => void;
}

export function HorseForm({ onSuccess }: HorseFormProps) {
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const addHorseMutation = useAddHorse();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    let profilePhoto: ExternalBlob | null = null;
    
    if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      profilePhoto = ExternalBlob.fromBytes(uint8Array);
    }
    
    await addHorseMutation.mutateAsync({ name: name.trim(), profilePhoto });
    
    setName('');
    setPhotoFile(null);
    setPhotoPreview(null);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Horse Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter horse name"
          required
          disabled={addHorseMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Profile Photo (Optional)</Label>
        <div className="flex items-center gap-4">
          {photoPreview && (
            <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border-2 border-border" />
          )}
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={addHorseMutation.isPending}
            className="flex-1"
          />
        </div>
      </div>

      <Button type="submit" disabled={addHorseMutation.isPending || !name.trim()} className="w-full">
        {addHorseMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Horse...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Add Horse
          </>
        )}
      </Button>
    </form>
  );
}
