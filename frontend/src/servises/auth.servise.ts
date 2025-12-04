import { AuthResponse } from "../types/auth";
import api from "../shared/lib/api/api-interceptor";
import { TypeLoginScheme, TypeRegisterSchema } from "@/feature/auth/schemes";
import { removeAccessToken, saveAccessToken } from "@/shared/lib/token/token-helper";

class AuthServices {
    public async register(data: TypeRegisterSchema): Promise<AuthResponse> {
        const res = await api.post<AuthResponse>("/auth/register", data)
        saveAccessToken(res.data.accessToken);
        return res.data;
    };

    public async login(data: TypeLoginScheme): Promise<AuthResponse> {
        const res = await api.post<AuthResponse>("/auth/login", data);
        saveAccessToken(res.data.accessToken);
        return res.data;
    };

    public async logout(): Promise<void> {
        const res = await api.post("/auth/logout");
        removeAccessToken()
        return res.data;
    };

    public async refreshTokens(): Promise<{ accessToken: string }> {
        const res = await api.post<{ accessToken: string }>("/auth/refresh")
        return res.data;
    }
}
export default new AuthServices();