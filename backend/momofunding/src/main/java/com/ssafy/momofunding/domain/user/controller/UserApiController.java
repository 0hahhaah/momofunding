package com.ssafy.momofunding.domain.user.controller;

import com.ssafy.momofunding.domain.user.domain.User;
import com.ssafy.momofunding.domain.user.dto.UserInfoResponseDto;
import com.ssafy.momofunding.domain.user.dto.UserSignUpRequestDto;
import com.ssafy.momofunding.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RequiredArgsConstructor
@RestController
public class UserApiController {
    private final UserService userService;

    //Sign-in
//    @PostMapping("/users/sign-in")
//    public Boolean signIn(String email, String password){
//        return userService.signIn(email,password);
//    }

    //Sign-up
    @PostMapping("/users")
    public ResponseEntity signUp(@RequestBody UserSignUpRequestDto userSignUpRequestDto) {
        userService.saveUserInfo(userSignUpRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    //닉네임 중복 조회
    @GetMapping("/users/nickname/{nickname}")
    public ResponseEntity<Map<String, Object>> checkNicknameDuplicate(@PathVariable("nickname") String nickname) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isExist",userService.findExistNickname(nickname));
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);    
    }

    //이메일 중복 조회
    @GetMapping("/users/email/{email}")
    public ResponseEntity<Map<String, Object>> checkEmailDuplicate(@PathVariable("email") String email) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isExist",userService.findExistEmail(email));
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

//    회원 정보 조회
    @GetMapping("/users/{userId}")
    public ResponseEntity getUserInfo(@PathVariable("userId") Long userId){
        try {
            User user = userService.getUserInfo(userId).orElse(null);
            if(user == null) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("There is no user info matching that ID");
            else {
                UserInfoResponseDto userInfoResponseDto = new UserInfoResponseDto(
                        user.getEmail(),
                        user.getPassword(),
                        user.getNickname(),
                        user.getRegisterDate()
                );
                return ResponseEntity.status(HttpStatus.OK).body(userInfoResponseDto);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
////
////    //회원 정보 수정
//    @PutMapping("/users/{userId}")
//    public ResponseEntity modifyUser(@PathVariable("userId") String userId){
//
//
//    }

////
////
////
////    //회원 탈퇴
////    @DeleteMapping("/users/{userId}")
////
////
////

////
////
////    //이메일 존재 여부 조회(아이디 찾기)
////    @GetMapping("/users/email/{email}")
//
//
//    //비밀번호 변경
////    @PutMapping("/users/password/{userId}");


}
