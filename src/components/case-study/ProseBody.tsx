interface ProseBodyProps {
  text: string;
}

export function ProseBody({ text }: ProseBodyProps) {
  const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`leading-relaxed text-text ${index === 0 ? 'text-lg' : 'text-base'}`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
