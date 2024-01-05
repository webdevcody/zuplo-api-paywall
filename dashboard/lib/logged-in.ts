import { Session } from "next-auth";

export type LoggedInSession = Session & {
  user: { email: string; name: string };
  accessToken: string;
};

export const isLoggedInSession = (
  session: Session | null
): session is LoggedInSession => {
  if (
    session === null ||
    !session.user ||
    !session.user.email ||
    !session.user.name
  ) {
    return false;
  }

  return true;
};
