import React from 'react';
import { ActivityItem, User } from '../types';

type AvatarSource =
  | Pick<User, 'id' | 'name' | 'avatarColor'>
  | Pick<ActivityItem, 'userId' | 'userName' | 'userColor'>;

interface UserAvatarProps {
  user: AvatarSource;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  className = '',
}) => {
  const isActivity = 'userId' in user;
  const name = isActivity ? user.userName : user.name;
  const color = isActivity ? user.userColor : user.avatarColor;
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`h-full w-full rounded-[inherit] flex items-center justify-center text-[0.65em] font-bold ${className}`}
      style={{ backgroundColor: `${color}25`, color }}
      role="img"
      aria-label={name}
    >
      {initials}
    </span>
  );
};
