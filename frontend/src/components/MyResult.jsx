import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { resultStyles } from "../assets/dummyStyles";

/* ---------------- Badge ---------------- */
const Badge = ({ percent }) => {
  if (percent >= 85)
    return <span className={resultStyles.badgeExcellent}>Excellent</span>;
  if (percent >= 65)
    return <span className={resultStyles.badgeGood}>Good</span>;
  if (percent >= 45)
    return <span className={resultStyles.badgeAverage}>Average</span>;
  return <span className={resultStyles.badgeNeedsWork}>Needs Work</span>;
};

/* ---------------- Main Component ---------------- */
const MyResult = ({ apiBase = "http://localhost:4000" }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState("all");
  const [technologies, setTechnologies] = useState([]);

  /* ---- Auth Header ---- */
  const getAuthHeader = useCallback(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  /* ---- Fetch Results ---- */
  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const email = currentUser?.email || "";

let q = `?email=${encodeURIComponent(email)}`;

if (selectedTechnology !== "all") {
  q += `&technology=${encodeURIComponent(selectedTechnology)}`;
}

        const res = await axios.get(`${apiBase}/api/results${q}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });

        if (!mounted) return;

        if (res.data?.success) {
          setResults(res.data.results || []);
        } else {
          setResults([]);
          toast.warn("Unexpected server response");
        }
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load results");
        setResults([]);
        toast.error("Failed to load results");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchResults();
    return () => (mounted = false);
  }, [apiBase, selectedTechnology, getAuthHeader]);

  /* ---- Fetch Technologies ---- */
  useEffect(() => {
    let mounted = true;

    const fetchTechnologies = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/results`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });

        if (!mounted || !res.data?.success) return;

        const uniqueTech = [
          ...new Set(res.data.results.map(r => r.technology).filter(Boolean)),
        ].sort();

        setTechnologies(uniqueTech);
      } catch (err) {
        console.error("Tech fetch failed");
      }
    };

    fetchTechnologies();
    return () => (mounted = false);
  }, [apiBase, getAuthHeader]);

  /* ---- Group by Track ---- */
  const grouped = useMemo(() => {
    const map = {};
    results.forEach(r => {
      const track = r.title?.split(" ")[0] || "General";
      map[track] = map[track] || [];
      map[track].push(r);
    });
    return map;
  }, [results]);

  return (
    <div className={resultStyles.pageContainer}>
      <div className={resultStyles.container}>
        <header className={resultStyles.header}>
          <h1 className={resultStyles.title}>Quiz Results</h1>
         
          <div className={resultStyles.headerControls}></div>
        </header>

        {/* Filters */}
        <div className={resultStyles.filterButtons}>
          <button
            onClick={() => setSelectedTechnology("all")}
            className={selectedTechnology === "all"
              ? resultStyles.filterButtonActive
              : resultStyles.filterButtonInactive}
          >
            All
          </button>

          {technologies.map(tech => (
            <button
              key={tech}
              onClick={() => setSelectedTechnology(tech)}
              className={selectedTechnology === tech
                ? resultStyles.filterButtonActive
                : resultStyles.filterButtonInactive}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && <div className={resultStyles.loadingText}>Loading...</div>}
        {error && <div className={resultStyles.errorText}>{error}</div>}

        {!loading && !error &&
          Object.entries(grouped).map(([track, items]) => (
            <section key={track} className={resultStyles.trackSection}>
              <h2 className={resultStyles.trackTitle}>{track} Track</h2>
              <div className={resultStyles.resultsGrid}>
                {items.map(item => (
                  <StripCard key={item._id || item.id} item={item} />
                ))}
              </div>
            </section>
          ))}

        {!loading && results.length === 0 && !error && (
          <div className={resultStyles.emptyState}>
            No results available
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- Strip Card ---------------- */
const StripCard = ({ item }) => {
  const percent = item.totalQuestions
    ? Math.round((item.correct / item.totalQuestions) * 100)
    : 0;

  return (
    <article className={resultStyles.card}>
      <div className={resultStyles.cardContent}>
        <h3 className={resultStyles.cardTitle}>{item.title}</h3>

        <div className={resultStyles.badgeContainer}>
          <Badge percent={percent} />
        </div>

        <div className={resultStyles.cardStats}>
          <div>Correct: <b>{item.correct}</b></div>
          <div>Wrong: <b>{item.wrong}</b></div>
          <div>Score: <b>{percent}%</b></div>
        </div>
      </div>
    </article>
  );
};

export default MyResult;