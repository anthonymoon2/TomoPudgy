import { type JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
  data:{
    username:string,
    id:string
  }
};

class AuthService {
  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  register(idToken: string){
    localStorage.setItem('id_token', idToken);
    window.location.assign('/profile');
  }
  
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/me');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
