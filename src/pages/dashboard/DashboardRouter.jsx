import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/ui/Loader';

const DashboardRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const computeAndRedirect = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('mission_progress')
          .select('day, mission, created_at')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (error) throw error;

        // Determine highest day where all 3 missions are complete
        if (!data || data.length === 0) {
          if (isMounted) navigate('/day/1', { replace: true });
          return;
        }

        const daysDone = {};
        const latestTime = {};

        data.forEach((row) => {
          if (!daysDone[row.day]) {
            daysDone[row.day] = new Set();
            latestTime[row.day] = 0;
          }
          daysDone[row.day].add(row.mission);
          const time = new Date(row.created_at).getTime();
          if (time > latestTime[row.day]) {
            latestTime[row.day] = time;
          }
        });

        let targetDay = 1;

        for (let d = 1; d <= 5; d++) {
          if (daysDone[d] && daysDone[d].size >= 3) {
            // Day d is complete
            // Check if 24 hours have passed since the LAST mission was completed on Day d
            const msPassed = Date.now() - latestTime[d];
            const hoursPassed = msPassed / (1000 * 60 * 60);

            if (hoursPassed >= 24) {
              targetDay = Math.min(d + 1, 5); // Advance!
            } else {
              targetDay = d; // Stuck on current day (will see "ComeBackTomorrow")
              break;
            }
          } else if (daysDone[d] && daysDone[d].size < 3) {
            targetDay = d;
            break; // Currently working on day d
          }
        }

        if (isMounted) {
          navigate(`/day/${targetDay}`, { replace: true });
        }
      } catch (err) {
        console.error("Error computing dashboard route: ", err);
        if (isMounted) navigate('/day/1', { replace: true });
      }
    };

    computeAndRedirect();

    return () => { isMounted = false; };
  }, [user, navigate]);

  return <Loader />; // Or just a simple spinner
};

export default DashboardRouter;
