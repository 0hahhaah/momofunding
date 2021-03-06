package com.ssafy.momofunding.domain.projectstate.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
@Entity
public class ProjectState {

    @Id
    Long id;

    @Column(nullable = false, length=10)
    String content;


    @Builder
    public ProjectState(String content){
        this.content = content;
    }
}
