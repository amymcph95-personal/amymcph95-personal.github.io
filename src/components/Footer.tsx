import Container from "./Container";

export default function Footer() {
  return (
    <footer className="pb-24 pt-10 sm:pb-16">
      <Container>
        <div className="flex flex-col items-center justify-between gap-3 t-footer border-t border-ink/10 pt-6 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Amy McPherson
          </p>
          <p>Built in Cursor</p>
        </div>
      </Container>
    </footer>
  );
}
