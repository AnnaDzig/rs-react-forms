type CountryDatalistProps = {
  countries: string[];
  id: string;
};

export function CountryDatalist({ countries, id }: CountryDatalistProps) {
  return (
    <datalist id={id}>
      {countries.map((country) => (
        <option key={country} value={country} />
      ))}
    </datalist>
  );
}
