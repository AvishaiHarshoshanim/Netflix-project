package features.threePages.ui.search;

import java.util.List;

import views.movies.Movie;

public class MoviesToShowResponse {
    private List<Movie> results;
    private List<Movie> recommendations;

    public List<Movie> getRecommendations() {
        return recommendations;
    }
    public List<Movie> getResults() {
        return results;
    }

    public void setResults(List<Movie> results) {
        this.results = results;
    }
}
