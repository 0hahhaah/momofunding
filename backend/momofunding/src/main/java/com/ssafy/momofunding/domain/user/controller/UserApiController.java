package com.ssafy.momofunding.domain.user.controller;

import com.ssafy.momofunding.domain.user.dto.*;
import com.ssafy.momofunding.domain.user.service.UserService;
import com.ssafy.momofunding.global.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "User API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserApiController {
    private final UserService userService;

    private final JwtService jwtService;

    //Sign-in
    @Operation(
            summary = "회원 로그인",
            description = "회원은 email과 password로 로그인 할 수 있다."
    )
    @PostMapping("/sign-in")
    public ResponseEntity signIn(@RequestBody UserSignInRequestDto userSignInRequestDto){
        Map<String, Object> responseMap = new HashMap<>();
        try {
            Long userId = userService.findEmailAndPassword(userSignInRequestDto);

            String token = jwtService.create("userId", userId, "access-token");

            responseMap.put("access-token", token);
            responseMap.put("userId", userId);
            responseMap.put("message", "success");
        }catch (EmptyResultDataAccessException e){
            responseMap.put("errorMsg", e.getMessage());
            responseMap.put("message", "fail");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
        }
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    //Sign-up
    @Operation(
            summary = "회원 가입",
            description = "회원은 email, password, nickname을 입력해 회원가입 할 수 있다."
    )
    @PostMapping("")
    public ResponseEntity signUp(@RequestBody UserSignUpRequestDto userSignUpRequestDto) {
        Map<String, Object> responseMap = new HashMap<>();
        Long userId = userService.saveUserInfo(userSignUpRequestDto);
        responseMap.put("userId",userId);
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    //닉네임 중복 조회
    @Operation(
            summary = "닉네임 중복 확인",
            description = "이미 동일한 닉네임이 있다면 true, 없다면 false 리턴"
    )
    @Parameter(name = "nickname", description = "중복 체크 할 닉네임", required = true)
    @GetMapping("/nickname/duplicate")
    public ResponseEntity<Map<String, Object>> isExistNickname(@RequestParam String nickname) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isExist",userService.findExistNickname(nickname));
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);    
    }

    //이메일 중복 조회
    @Operation(
            summary = "이메일 중복 확인",
            description = "이미 동일한 이메일이 있다면 true, 없다면 false 리턴"
    )
    @Parameter(name = "email", description = "중복 체크 할 이메일", required = true)
    @GetMapping("/email/duplicate")
    public ResponseEntity<Map<String, Object>> isExistEmail(@RequestParam String email) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isExist",userService.findExistEmail(email));
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    //회원 정보 조회
    @Operation(
            summary = "회원 정보 조회",
            description = "userId를 통해 회원 정보 조회 email, password, nickname, 가입일자를 리턴"
    )
    @Parameter(name = "userId", description = "조회 할 유저의 id", required = true)
    @GetMapping("/{userId}")
    public ResponseEntity findUserInfoById(@PathVariable("userId") Long userId){
        UserInfoResponseDto userInfoResponseDto;
        Map<String, Object> responseMap = new HashMap<>();
        try {
            userInfoResponseDto = userService.findUserInfoById(userId);
        }catch (IllegalArgumentException e){
            responseMap.put("errorMsg", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
        }
        return ResponseEntity.status(HttpStatus.OK).body(userInfoResponseDto);
    }

    //회원 정보 수정
    @Operation(
            summary = "회원 정보 수정",
            description = "userId와 RequestBody로 회원정보 수정"
    )
    @Parameter(name = "userId", description = "수정 할 유저의 id", required = true)
    @PutMapping("/{userId}")
    public ResponseEntity updateUser(@PathVariable("userId") Long userId, @RequestBody UserInfoUpdateRequestDto userInfoUpdateRequestDto){
        Map<String, Object> responseMap = new HashMap<>();
        try {
            userService.updateUserInfo(userId, userInfoUpdateRequestDto);
        }catch (IllegalArgumentException e) {
            responseMap.put("errorMsg", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
        }
        responseMap.put("userID", userId);
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    //회원 삭제
    @Operation(
            summary = "회원 정보 삭제",
            description = "userId로 회원 삭제"
    )
    @Parameter(name = "userId", description = "삭제 할 유저의 id", required = true)
    @DeleteMapping("/{userId}")
    public ResponseEntity deleteUser(@PathVariable("userId") Long userId){
        Map<String, Object> responseMap = new HashMap<>();
        try {
            userService.deleteById(userId);
        }catch (EmptyResultDataAccessException e){
            responseMap.put("errorMsg", "해당 Id가 존재하지 않습니다. UserId : " + userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
        }
        responseMap.put("userId", userId);
        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }
}
