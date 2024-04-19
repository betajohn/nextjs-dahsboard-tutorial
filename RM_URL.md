# URl api notes and tips

## what is a URL?

Uniform Resource Locator (URL) is a text string that specifies where a resource (such as a web page, image, or video) can be found on the Internet.

In the context of HTTP, URLs are called "Web address" or "link".

Some browsers display only the part of a URL after the "//", that is, the Domain name.

## HTTP

http://: This is the protocol used to transfer data from a web server to a browser. In this case, it's the standard Hypertext Transfer Protocol (HTTP).

## Domain Name

A domain name is a website's address on the Internet.

The domain name consists of a hierarchical sequence of names (labels) separated by periods (dots) and ending with an extension (extensions are called TLD).

### TLD (Top level domain name)

A TLD is the final component of a domain name, for example, "org" in developer.mozilla.org.

TLD often serves as a clue to the purpose, ownership, or nationality of a website. (i.e. com = commercial purposes)

```text
https://developer.mozilla.org  = domain name

org = TLD
mozilla.org = second-level domain name
developer =subdomain name
```

### country-code top-level domains (ccTLD)

Two-character domains established for countries or territories. Example: .us for United States.

## Path

Represents a location in a hierarchical structure.

The URL https://developer.mozilla.org has just one path segment: the empty string, so its pathname value is constructed by prefixing a / character to the empty string.

```text
https://developer.mozilla.org  // path= '/'
https://developer.mozilla.org/about // path= '/about'
```

## Query parameter

It's a way to pass data to the server as part of the URL.

```text
http://localhost:3000/dashboard/invoices?query=okabe

 key "query" and value "okabe"
```
