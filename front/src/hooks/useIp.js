import { useState } from 'react';

const useIp = () => { 
  const [ip, setIp] = useState("10.1.4.76");

  return { ip };
};

export { useIp };
