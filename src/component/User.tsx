export interface User
{
    id: string;
    username: string;
    email: string;
    hash: string;
}

export interface UserAuthToken
{
  userId: string;
  token: string;
  Expire: string;
}