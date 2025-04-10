import { useEffect, useState } from "react";
import { getPrefixes } from "../services/api";
import Spinner from "./Spinner";

const CountryPrefix = ({ onChange }) => {
  const [countryPrefixes, setCountryPrefixes] = useState([]);

  useEffect(() => {
    const fetchPrefixes = async () => {
      const prefixes = await getPrefixes();
      setCountryPrefixes(prefixes);
    };
    fetchPrefixes();
  }, []);

  return (
    <div>
      {countryPrefixes.length > 0 ? (
        <select
          id="country"
          name="country"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="text-black mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
        >
          {countryPrefixes.map((country) => (
            <option
              className="text-black"
              key={country.prefix}
              value={country.prefix}
            >
              {country.country} ({country.prefix})
            </option>
          ))}
        </select>
      ) : (
        <span>
          <Spinner />
        </span>
      )}
    </div>
  );
};

export default CountryPrefix;
