package hello.login.web;

import hello.login.domain.member.Member;
import hello.login.domain.member.MemberReposiotry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {

    private final MemberReposiotry memberReposiotry;

   // @GetMapping("/")
    public String home() {
        return "home";
    }

    //@GetMapping("/")
    public String homeLogin(@CookieValue(name="memberId", required = false) Long memberId, Model model){
        if(memberId == null){
            return "home";
        }

        //로그인
        Member loginMember = memberReposiotry.findById(memberId);
        if(loginMember == null){
            return "home";
        }

        model.addAttribute("member",loginMember);

        return "login/loginHome";
    }

    //@GetMapping("/")
    public String homeLoginV3(HttpServletRequest request, Model model){

        HttpSession session = request.getSession(false);
        if(session == null){
            return "home";
        }
        Member loginMember = (Member)session.getAttribute(SessionConst.LOGIN_MEMBER);
        // session에 값이 없으면 home으로 간다.
        if(loginMember == null){
            return "home";
        }

        model.addAttribute("member",loginMember);

        return "login/loginHome";
    }

    @GetMapping("/")
    public String homeLoginV3Spring(@SessionAttribute(name = SessionConst.LOGIN_MEMBER,required = false) Member loginMember, Model model){

        // session에 값이 없으면 home으로 간다.
        if(loginMember == null){
            return "home";
        }

        model.addAttribute("member",loginMember);

        return "login/loginHome";
    }

//    @PostMapping("/logout")
//    public String logout(HttpServletResponse response){
//        expireCookie(response,"memberId");
//        return "redirect:/";
//    }
//
//    private static void expireCookie(HttpServletResponse response,String cookieName) {
//        Cookie cookie = new Cookie(cookieName,null);
//        cookie.setMaxAge(0);
//        response.addCookie(cookie);
//    }
}