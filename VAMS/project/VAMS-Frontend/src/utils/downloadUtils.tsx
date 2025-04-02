export const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  