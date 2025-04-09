import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { sessionService } from "../services/session/sessionService";
import { Session, PaginationInfo } from "../types/session";

export function useSession() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchSessions = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await sessionService.listSessions(page);
        setSessions(response.data || []);
        setPagination(response.pagination || pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createSession = async (
    name: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const response = await sessionService.createSession(name, metadata);
      setSessions((prev) => [...prev, response.data!]);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSession = async (sessionId: string, name: string) => {
    try {
      const response = await sessionService.updateSessionName(sessionId, name);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? response.data! : session
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await sessionService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      sessionService.setToken(token);
      fetchSessions();
    }
  }, [token, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    pagination,
    createSession,
    updateSession,
    deleteSession,
    fetchSessions,
  };
}
