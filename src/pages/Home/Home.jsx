import Header from "@components/Header/Header";
import Preloader from '@components/Preloader/Preloader';
import MovieSlider from '@components/MovieSlider/MovieSlider';
import MovieList from "../../components/MovieList/MovieList";


const Home = () => {
    return (
        <>
            <Preloader></Preloader>
            <Header></Header>
            <MovieSlider></MovieSlider>
            <MovieList></MovieList>
        </>
    )
}

export default Home;