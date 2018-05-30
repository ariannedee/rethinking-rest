var commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

var queryRepoList = `
  {
    viewer {
      name
      repositories (first: 100) {
        nodes {
          name
        }
      }
    }
  }
`;

var queryRepoSummary;

var mutationAddStar;

var mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
    // MAKE GRAPHQL REQUEST
    $.post({
        url: "https://api.github.com/graphql",
        contentType: "application/json",
        headers: {
            Authorization: "bearer 2d919a83aa42902ffe6317c2968b824d7efeb23f"
        },
        data: JSON.stringify({
            query: query,
            variables: variables
        }),
        success: onSuccess,
        error: (error) => console.log(error)
    });
}

function showDetails(element) {
    // GET NAME AND SUMMARY FOR REPOSITORY

}

$(window).ready(function() {
    // GET NAME AND REPOSITORIES FOR VIEWER
    gqlRequest(queryRepoList, {}, (response) => {
        console.log(response);
        let viewer = response.data.viewer;
        $("header h2").text(`Hello ${viewer.name}`);
        let ol = $("ol.repos");
        ol.empty();
        viewer.repositories.nodes.forEach((repo) => {
            let li = `<li>${repo.name}</li>`;
            ol.append(li);
        })
    });


    $("button.star").click((event) => {
        // STAR OR UNSTAR SELECTED REPO
    });
});