# Opis aplikacji Social-App

Jest to projekt (w budowie) aplikacji modelującej zachowanie medium społecznościowego (wzorowana na twitterze). Pozwala na zarejestrowanie[^1] i zalogowanie użytkownika, dodawanie i wyświetlanie postów, dodawania lajków, subskrybowania użytkowników.

## Wykorzystywane narzędzia i technologie
- React
- React-router-dom
- Biblioteka _axios_ do tworzenia zapytań
- Local Storage 
- JSON Web Token
- HTML
- CSS
## Sposób logowania
Logowanie działa tylko dla predefiniowanych użytkowników:  
     **_hasło_**: 1234   
     **_możliwe nazwy użytkownika_**: artur, marek, adam, slawek, mietek, tomek, kasia, janek
## Źródła
[Akademia 108](https://akademia108.pl/) - API i dokumentacja

## Sposób uruchomienia
 W katalogu z projektem uruchomić w konsoli (obsługującej polecenia git) następujące polecenia:

``` 
npm install
npm start
```

Otworzyć [http://localhost:3000](http://localhost:3000) żeby zobaczyć działającą aplikację w przeglądarce.

[^1]: Użytkownicy nie są rejestrowanie w bazie, ale API odpowiada tak, jakby była to prawdziwa rejestracja.
