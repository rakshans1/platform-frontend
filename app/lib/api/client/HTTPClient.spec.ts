import { expect } from "chai";
import { SinonSpy, spy } from "sinon";

import { HttpClient } from "./HttpClient";
import { HttpMethod, IHttpRequestCommon, IHttpResponse } from "./IHttpClient";

describe("HTTPClient", () => {
  function createCustomHttpClient(spy: SinonSpy): HttpClient {
    return new class extends HttpClient {
      protected makeFetchRequest: <T>(
        fullUrl: string,
        method: HttpMethod,
        config: IHttpRequestCommon,
      ) => Promise<IHttpResponse<T>> = spy;
    }();
  }

  describe("get", () => {
    it("should make request with baseUrl url and query string", async () => {
      const makeFetchSpy = spy();

      const client = createCustomHttpClient(makeFetchSpy);

      const config = {
        baseUrl: "https://platform.neufund.org/api",
        url: "eto",
        queryParams: { foo: "bar", baz: "quux" },
      };

      await client.get(config);

      expect(makeFetchSpy).to.be.calledOnceWith(
        "https://platform.neufund.org/api/eto?baz=quux&foo=bar",
        "GET",
        config,
      );
    });

    it("should make request without baseUrl and query string", async () => {
      const makeFetchSpy = spy();

      const client = createCustomHttpClient(makeFetchSpy);

      const config = { url: "eto" };

      await client.get(config);

      expect(makeFetchSpy).to.be.calledOnceWith("/eto", "GET", config);
    });
  });
});
