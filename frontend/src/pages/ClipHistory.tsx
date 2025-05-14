import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface ClipRecord {
  id: number;
  title: string;
}

const ClipHistory: React.FC = () => {
  const [records, setRecords] = useState<ClipRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electronAPI.fetchHistory();
        setRecords(result);
      } catch (err) {
        console.error('获取剪辑历史失败:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">📂 剪辑历史记录</h2>
      {records.length === 0 ? (
        <p>暂无剪辑记录</p>
      ) : (
        records.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span>{record.title}</span>
                <Button variant="outline" onClick={() => alert(`打开记录 ${record.id}`)}>
                  查看详情
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClipHistory;
