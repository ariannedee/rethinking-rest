const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
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

let queryRepoList;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST

}

function starHandler(element) {
  // GET NAME AND SUMMARY FOR REPOSITORY

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER

  $("button.star").click((event) => {
    // STAR OR UNSTAR SELECTED REPO
  });
});