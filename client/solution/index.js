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

const queryRepoList = `
{
  viewer {
    name
		repos: repositories (first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        id
        starred: viewerHasStarred
        pullRequests (states: OPEN) {
          totalCount
        }
        issues (states: OPEN) {
          totalCount
        }
        ... commitFragment
      }
    }    
  }
}` + commitFragment;

const mutationAddStar = `
mutation addStar ($id: ID!) {
  addStar (input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        viewerHasStarred
      }
    }
  }
}`;

const mutationRemoveStar = `
mutation removeStar ($id: ID!) {
  removeStar (input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        viewerHasStarred
      }
    }
  }
}`;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    headers: {
      Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    },
    contentType: "application/json",
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response);
      }
    },
    error: (error) => console.log(error)
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE
  if ($(element).text() === emptyStar) {
    gqlRequest(mutationAddStar, {id: element.id}, () => $(element).text(fullStar));
  } else {
    gqlRequest(mutationRemoveStar, {id: element.id}, () => $(element).text(emptyStar));
  }

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {},
    (response) => {
      $('header h2').text(`Hello ${response.data.viewer.name}`);
      const repos = response.data.viewer.repos;
      if (repos.totalCount > 0) {
        $('ul').empty();
      }
      repos.nodes.forEach((repo) => {
        const star = repo.starred? fullStar : emptyStar;
        const card = `
        <h3>
          ${repo.name}
          <span id=${repo.id} class="star" onClick="starHandler(this)">${star}</span>
        </h3>
        <p>${repo.pullRequests.totalCount} open PRs</p>
        <p>${repo.issues.totalCount} open issues</p>
        <p>${repo.ref.target.history.totalCount} commits</p>
        `;
        $("ul.repos").append(`<li><div>${card}</div></li>`)
      });
    });
});