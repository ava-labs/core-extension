import { useCallback, useState } from 'react';

const readJsonFile = async <T>(jsonFile: File) =>
  new Promise<T>((resolve, reject) => {
    const fr = new FileReader();

    fr.onload = () => {
      try {
        resolve(JSON.parse(fr.result as string));
      } catch (err: any) {
        reject(err.toString());
      }
    };

    fr.onerror = () => {
      reject(fr.error);
    };

    fr.readAsText(jsonFile);
  });

export const useJsonFileReader = <T>() => {
  const [isReading, setIsReading] = useState(false);

  const read = useCallback(async (file: File): Promise<T> | never => {
    setIsReading(true);

    try {
      return await readJsonFile<T>(file);
    } finally {
      setIsReading(false);
    }
  }, []);

  return {
    read,
    isReading,
  };
};
