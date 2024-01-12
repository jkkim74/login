package hello.login.domain.login;


import hello.login.domain.member.Member;
import hello.login.domain.member.MemberReposiotry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final MemberReposiotry memberReposiotry;


    public Member login(String loginId, String password){
        return memberReposiotry.findByLoginId(loginId).filter(m -> m.getPassword().equals(password))
                .orElse(null);
    }
}
