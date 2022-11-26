import { User } from "../models";

export const updateUserLastSeen = async (userId) => {
  const lastSeen = new Date().toISOString();
  await User.update({ lastSeen }, { where: { userId } });

  return true;
};

function OnlineUsersStorage() {
  const data = new Map();
  return {
    get(userId) {
      return data.get(userId);
    },
    set(userId, socketId) {
      data.set(userId, socketId);
    },
    entries() {
      return data.entries();
    },
    delete(key) {
      return data.delete(key);
    },
  };
}

export const OnlineUsersStore = OnlineUsersStorage();
