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

var queryRepoList;

var queryRepoSummary;

var mutationAddStar;

var mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
    // MAKE GRAPHQL REQUEST

}

function showDetails(element) {
    // GET NAME AND SUMMARY FOR REPOSITORY

}

$(window).ready(function() {
    // GET NAME AND REPOSITORIES FOR VIEWER

    $("button.star").click((event) => {
        // STAR OR UNSTAR SELECTED REPO
    });
});