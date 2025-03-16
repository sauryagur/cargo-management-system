import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Import() {
  const [itemsFile, setItemsFile] = useState<File | null>(null);
  const [containersFile, setContainersFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-tektur text-white mb-8">Import Data</h1>
      
      <div className="space-y-8">
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
          <h2 className="text-lg font-tektur text-white mb-4">Import Items</h2>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setItemsFile(e.target.files?.[0] || null)}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              disabled={!itemsFile}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Upload Items
            </Button>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
          <h2 className="text-lg font-tektur text-white mb-4">Import Containers</h2>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setContainersFile(e.target.files?.[0] || null)}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              disabled={!containersFile}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Upload Containers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}