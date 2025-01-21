export interface iJwtService {
    generateToken(userId: string): string;
    verifyToken(Token: string): { id: string } | null;
    generateRefreshToken(userId: string): string;
    VerifyTokenRefresh(Token: string): { id: string } | null;
}
