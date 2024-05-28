export function viewClose(search, close) {
  if (search === "") {
    close.classList.add("hidden");
  } else {
    close.classList.remove("hidden");
  }
}
