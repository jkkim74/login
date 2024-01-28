package hello.login.web.session;


import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class SessionManager {

    private static final String SESSION_COOKIE_NAME = "mySeesionId";
    private Map<String, Object> sessionStore = new ConcurrentHashMap<>();

    public void createSession(Object value, HttpServletResponse response){

        //session Id 생성, 값을 저장
        String sessionId = UUID.randomUUID().toString();
        sessionStore.put(sessionId,value);

        //쿠키 생성
        Cookie mySessionCookie = new Cookie(SESSION_COOKIE_NAME, sessionId);

        response.addCookie(mySessionCookie);

    }

    /**
     * 세션조회
     */
    public Object getSession(HttpServletRequest request){
        Cookie seesionCookie = findCookie(request, SESSION_COOKIE_NAME);
        if(seesionCookie == null){
            return null;
        }
        return sessionStore.get(seesionCookie.getName());
    }

    public Cookie findCookie(HttpServletRequest request, String cookieName){
        if(request.getCookies() == null){
            return null;
        }
        return  Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(cookieName))
                .findAny()
                .orElse(null);
    }
}
