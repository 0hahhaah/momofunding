package com.ssafy.momofunding.global.config;

import com.ssafy.momofunding.global.interceptor.JwtInterceptor;
import com.ssafy.momofunding.global.interceptor.MethodInteceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final List<String> methodPatterns = Arrays.asList("/**");

    private static final List<String> addPatterns =
            Arrays.asList("/creator/*", "/surveys/**", "/users/*");
    private static final List<String> excPatterns =
            Arrays.asList("/users/sign-ian", "/users/sign-up");

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Autowired
    private MethodInteceptor methodInteceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
//        GET이외의 모든 작업에서 jwt인증을 함
//        registry.addInterceptor(methodInteceptor)
//                .addPathPatterns(methodPatterns)
//                .excludePathPatterns(excPatterns);

//        //GET중에서 특정 URI만 jwt인증을 함
//        registry.addInterceptor(jwtInterceptor)
//                .addPathPatterns(addPatterns);


    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
//		System.out.println("CORS Setting");
//		default 설정.
//		Allow all origins.
//		Allow "simple" methods GET, HEAD and POST.
//		Allow all headers.
//		Set max age to 1800 seconds (30 minutes).
        registry.addMapping("/**")
                .allowedOrigins("*")
//			.allowedOrigins("http://localhost:8080", "http://localhost:8081")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(1800);
    }

    //	Swagger UI 실행시 404처리
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/swagger-ui.html**").addResourceLocations("classpath:/META-INF/resources/swagger-ui.html");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}