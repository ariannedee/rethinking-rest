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
      repositories (first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

var queryRepoSummary = `
query ($id: ID!) {
    node (id: $id){
      ... on Repository {
        name
        nameWithOwner
        ... commitFragment
      }
    }
  }
` + commitFragment;

var mutationAddStar;

var mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
    // MAKE GRAPHQL REQUEST
    $.post({
        url: "https://api.github.com/graphql",
        contentType: "application/json",
        headers: {
            Authorization: "bearer ..."
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
    gqlRequest(queryRepoSummary, {id: element.id}, (response) => {
        console.log(response);
        $(".no-selection").hide();
        $(".selected-details").show();
        $("#repoName").text(response.data.node.name);
        $("#repoCommits").text(response.data.node.ref.target.history.totalCount);
    })
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
            let li = `<li id=${repo.id} onClick=showDetails(this)>${repo.name}</li>`;
            ol.append(li);
        })
    });


    $("button.star").click((event) => {
        // STAR OR UNSTAR SELECTED REPO
    });
});