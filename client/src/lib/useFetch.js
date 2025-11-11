import { useEffect, useState } from "react";
import api from "./api";

export default function useFetch(url, params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.get(url, { params })
      .then(({ data }) => { if (isMounted) setData(data); })
      .catch(e => isMounted && setErr(e?.response?.data?.message || "Gabim ngarkimi."))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [url, JSON.stringify(params)]);
  return { data, loading, err, setData };
}
