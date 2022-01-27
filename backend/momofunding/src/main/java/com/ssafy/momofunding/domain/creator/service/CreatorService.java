package com.ssafy.momofunding.domain.creator.service;

import com.ssafy.momofunding.domain.creator.domain.Creator;
import com.ssafy.momofunding.domain.creator.dto.CreatorDetailResponseDto;
import com.ssafy.momofunding.domain.creator.dto.CreatorUpdateRequestDto;
import com.ssafy.momofunding.domain.creator.repository.CreatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@RequiredArgsConstructor
@Service
public class CreatorService {

    private final CreatorRepository creatorRepository;

    @Transactional
    public void updateCreator(Long creatorId, CreatorUpdateRequestDto creatorUpdateRequestDto){
        Creator creator = creatorRepository.findById(creatorId)
                .orElseThrow(()-> new IllegalArgumentException("잘못된 창작자 번호입니다:: creatorId-"+creatorId));

        creator.updateCreator(creatorUpdateRequestDto);
    }

    @Transactional
    public CreatorDetailResponseDto findCreatorByProjectId(Long projectId) {
        Creator creator = creatorRepository.findByProjectId(projectId)
                .orElseThrow(()-> new IllegalArgumentException("잘못된 프로젝트 번호입니다:: projectId-"+projectId));
        return new CreatorDetailResponseDto(creator);
    }
}
