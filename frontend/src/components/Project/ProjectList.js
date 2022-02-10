// // 카드로 여러개 나열되어 있는 페이지
import axios from 'axios';
import { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import HomeBanners from "../Home/HomeBanners";
import ProjectCard from "./ProjectCard";
import { ListNav, Category, Search, Bar, ListFilter, ListFilterSelected } from './Project.styled';
import NonExist from './NonExist';
import { baseUrl } from '../../App';

function ProjectList(){
  const [isDate, setIsDate] = useState(true);
  const [isPop, setIsPop] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([""]);
  const [categories, setCategories] = useState([""]);
  const [selected, setSelected] = useState(0);
  const [sort, setSort] = useState("");
  const [isExist, setIsExist] = useState(true);
  const all = [
    {
      id: 0,
      name: "전체"
    }
  ];
  var orderQuery = "";
  var categoryQuery = "";
  var keywordQuery = "";

  const handleSelect = (e) =>{
    setSelected(Number(e.target.value));
    setSearch("");
  }

  const Categories = async() => {
    await axios({
      url:`/categories`,
      method:"get",
      baseURL: baseUrl,
    })
    .then((response)=>{
      setCategories([...all, ...response.data]);
    })
    .catch((err) =>{
      console.log(err);
    })
  }

  const enterkey = () =>{
    if(window.event.keyCode === 13) Setlist();
  }

  const Setlist = async() =>{
    if(isDate){
      orderQuery = "?order=date";
    } else{
      orderQuery = "?order=popularity";
    }

    if(selected !== 0) categoryQuery = "&categoryId="+selected;
    else categoryQuery = "";

    if(search !== "") keywordQuery = "&keyword="+search;
    else keywordQuery = "";

    
    await axios({
      url:`http://localhost:8080/projects/search`+orderQuery+categoryQuery+keywordQuery,
      method:"get",
      baseURL: baseUrl,
    })
    .then((response)=>{
      setProjects([...response.data]);
      if(response.data === "") setIsExist(false);
      else setIsExist(true);
    })
    .catch((err) =>{
      console.log(err);
    })
  }

  useEffect(()=>{
    Categories();
  }, []);

  useEffect(()=>{
    Setlist();
  },[ selected, isPop, isDate ]);

  return(
    <>
      <HomeBanners />
      <ListNav>
        <Category>
          <span id="category">카테고리</span>
          <select onChange={handleSelect} value={selected}>
            {categories.map((category) =>(
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
            </select>
        </Category>

        <Search>
          <input
            type="text"
            value={search}
            onKeyUp={enterkey}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <svg
            onClick={() => {
              Setlist();
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>

          {
            isPop
            ?(<ListFilterSelected>인기순</ListFilterSelected>)
            :(<ListFilter onClick={()=>{setIsPop(true); setIsDate(false); }}>인기순</ListFilter>)
          }
          {
            isDate
            ?(<ListFilterSelected>최신순</ListFilterSelected>)
            :(<ListFilter onClick={()=>{setIsDate(true); setIsPop(false);}}>최신순</ListFilter>)
          }
        </Search>
      </ListNav>
      <Bar />

      <Container>
        <div className="container">
          <div className="row">
            {
             isExist
             ? (
              projects.map((project) => (
                <ProjectCard
                  project={project}
                  key={project.id}
                />
              ))
             )
             : <NonExist />
            }
          </div>
        </div>
      </Container>
    </>
  );
}

export default ProjectList;