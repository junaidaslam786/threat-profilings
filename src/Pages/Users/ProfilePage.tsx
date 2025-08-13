import { useGetProfileQuery } from "../../Redux/api/userApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "../../utils/errorHandling";
import UserProfileCard, {
  type UserProfile,
} from "../../components/Users/UserProfileCard";
import LoadingScreen from "../../components/Common/LoadingScreen";

export default function ProfilePage() {
  const { data, isLoading, error } = useGetProfileQuery();

  useEffect(() => {
    if (error) {
      const msg = extractErrorMessage(error) || "Failed to load profile.";
      toast.error(msg);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      {data ? (
        <UserProfileCard profile={data as unknown as UserProfile} />
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg">
          <div className="text-gray-400">No profile data found.</div>
        </div>
      )}
    </div>
  );
}
