package hello.login.web.upload;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/image")
public class ImageController {

    @GetMapping("/uploadImg")
    public String uploadImg(){
        return "upload/imageUploader";
    }

    @GetMapping("/write")
    public String write(){
        return "upload/write";
    }

    @GetMapping("/test_new")
    public String test_new(){
        return "upload/test_new";
    }
}
