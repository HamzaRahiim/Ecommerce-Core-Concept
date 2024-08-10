"use client";
import { RootState } from "@/app/store/store";
import { useAppSelector } from "@/app/store/hooks";

const Display = () => {
  const { results, loading, error } = useAppSelector(
    (state: RootState) => state.search
  );

  return (
    <div>
      {loading && <p>Loading results...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <ul>
              {results.map((result: any) => (
                <li key={result.id}>
                  <li>{result.name}</li>
                  <li>{result.price}</li>
                </li> // Customize display
              ))}
            </ul>
          ) : (
            <p className="text-lg">Please Try to search different product..</p>
          )}
        </>
      )}
    </div>
  );
};

export default Display;
