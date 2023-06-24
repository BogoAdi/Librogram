# Librogram
Librogram: APLICAȚIE PENTRU CITITORI ȘI RELAȚIONAREA ÎNTRE UTILIZATORI
# Instalare și rulare proiect

Sunt necesare urmatoarele programe pentru a rula cu succes aplicatia:      
    1. Git Bash  
    2. .NET 6 (SDK x64)  
    3. SQL Server Management Studio   
    4. Node.js  
  
Ca IDE-uri pentru scrierea proiectului s-au folosit:  
    1. Visual Studio 2022  
    2. Visual Studio Code  
  
Odată ce acestea programe au fost instalate se vor urma următorii pași pentru backend:  
    1. Deschide proiectul de backend cu Visual Studio 2022  
    2. Din proiectul de API se va deschide fișierul appsettings și se va modifica după cum este explicat mai jos:  
      
    "ConnectionStrings": {  
    "Default": "Data Source={your data source};Initial Catalog=LibrogramDB;Integrated Security=True;Connect  Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False",   
  },    
    ```
  3. Odată ce connection string-ul a fost setat se va folosi package manager console din visual studio se va seta proiectul default Librogram.Dal și
  se va introduce următoarea comandă în consolă:  
  ```
  update-database
  ```
  4. După ce baza de date a fost actualizată cu migrările proiectului se va seta Librogram.Api ca startup project, iar backend-ul va putea să fie rulat  
       
Pașii frontend:  
  1. Se va deschide folder-ul de frontend în visual studio code: Librogram\frontend\frontend_librogram  
  2. Se va scrie comanda urmatoare pentru instalarea tuturor pachetelor:   
  ```
  npm install
  ```
  3. După care se poate rula proiectul cu comanda:  
  ```
  npm start
  ```
Odată ce acești pași au fost urmați se poate folosi aplicația. Pentru a funcționa aceste 2 programe trebuie să fie în execuție.     
Dacă se folosesc alte porturi decît cele specificate în fișierul json env din:  
Librogram\frontend\frontend_librogram\src\env  se vor putea modifica aici  
```
{
    "redirect_url": "http://localhost:3000",
    "base_url":  "https://localhost:7002"
}
```
De asemenea se va modifica și în Librogram/backend/Api/Program.cs ca în secvența de cod de mai jos:  
```
   options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                          policy.WithOrigins("http://localhost:3000", "{frontend-app-url}");

                      });
```

