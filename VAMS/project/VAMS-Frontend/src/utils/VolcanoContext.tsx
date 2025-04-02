import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Volcano } from './interfaces';
import { fetchData, addVolcano, editVolcano, deleteVolcano } from './utils';

type VolcanoContextType = {
  loading: boolean;
  error: Error | null;
  currVolcano?: Volcano;
  volcanoList: Volcano[];
  setCurrVolcano: (volcano: Volcano) => void;
  fetchVolcanoes: () => Promise<void>;
  addNewVolcano: (volcano: Volcano) => Promise<void>;
  editCurrentVolcano: (volcano: Volcano) => Promise<void>;
  deleteCurrentVolcano: () => Promise<void>;
};

const VolcanoContext = createContext<VolcanoContextType | undefined>(undefined);

export const VolcanoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currVolcano, setCurrVolcano] = useState<Volcano | undefined>();
  const [volcanoList, setVolcanoList] = useState<Volcano[]>([]);

  const fetchVolcanoList = async () => {
    setLoading(true);
    setError(null);
    try {
      const volcanoes = await fetchData();
      // console.log("VolcanoContext - Data: ", volcanoes);
      setVolcanoList(volcanoes);
      setCurrVolcano(volcanoes[0]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addNewVolcano = async (volcano: Volcano) => {
    setLoading(true);
    setError(null);
    try {
      const newVolcano = await addVolcano(volcano);
      setVolcanoList((prevList) => [...prevList, newVolcano]);
      setCurrVolcano(newVolcano);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCurrentVolcano = async (volcano: Volcano) => {
    if (!currVolcano) return;
    setLoading(true);
    setError(null);
    try {
      const updatedVolcano = await editVolcano(volcano, currVolcano.id);
      setVolcanoList((prevList) =>
        prevList.map((v) => (v.id === currVolcano.id ? updatedVolcano : v))
      );
      setCurrVolcano(updatedVolcano);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentVolcano = async () => {
    if (!currVolcano) return;
    setLoading(true);
    setError(null);
    try {
      await deleteVolcano(currVolcano.id);
      setVolcanoList((prevList) => prevList.filter((v) => v.id !== currVolcano.id));
      const newCurrVolcano = volcanoList.find((v) => v.id !== currVolcano.id);
      setCurrVolcano(newCurrVolcano || volcanoList[0]);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolcanoList();
  }, []);

  return (
    <VolcanoContext.Provider
      value={{
        loading,
        error,
        currVolcano,
        volcanoList,
        setCurrVolcano,
        fetchVolcanoes: fetchVolcanoList,
        addNewVolcano,
        editCurrentVolcano,
        deleteCurrentVolcano,
      }}
    >
      {children}
    </VolcanoContext.Provider>
  );
};

export const useVolcanoContext = (): VolcanoContextType => {
  const context = useContext(VolcanoContext);
  if (!context) {
    throw new Error('useVolcanoContext must be used within a VolcanoProvider');
  }
  return context;
};
