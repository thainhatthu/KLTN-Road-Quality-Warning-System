HELLO N3Twork
Nhằm không đi lại vết xe đổ của cái app Plan\*\* đó thì mình có những quy định trong code như sau:
Ngôn ngữ sử dụng: Typescript
CSS framework: Tailwind CSS

- Về pages & components:
  - Các component trong page không được code trực tiếp trong page, code trong components rồi gọi qua page sau.
  - Việc gọi qua page sử dụng component có sẵn sẽ giúp code dễ bảo trì hơn, dễ tìm kiếm và sửa lỗi hơn.
  - Ví dụ pages/Auth/Auth.tsx sẽ gọi đến 2 component là Login và SignUp, ví dụ nếu code cả 2 trong 1 file Auth.tsx, code sẽ rất dài và khó sửa lỗi.
    => Do đó, tách components và pages ra nhé
- Về path.ts: Sử dụng các đường dẫn routes cho pages (src/routes/path.ts), và nhớ gọi trong App.tsx nếu muốn truy cập trong web