import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
export const LessonHome = () => {
  const [content, setContent] = useState<string>('');
  useEffect(() => {
    fetch('lessons/home.txt')
      .then(res => res.text())
      .then(result => {
        setContent(content);
      });
  }, []);
  return (
    <Container>
      <div id='wiki-content'>
        <div className='breadcrumb'></div>
        <div>
          <div
            id='wiki-body'
            className='gollum-markdown-content overflow-hidden '
          >
            <div className='markdown-body '>
              <h1 className='editable'>
                <a className='anchor' id='giới-thiệu' href='#giới-thiệu'></a>
                Giới thiệu
              </h1>
              <p>
                Thư viện VNOI được xây dựng với mục đích chia sẻ kiến thức Tin
                học đến với tất cả mọi người. Bạn có thể đọc bài giới thiệu của
                bọn mình{' '}
                <Link className='link' to='about'>
                  ở đây
                </Link>
                .
              </p>
              <p>
                Bạn đọc bài viết nhưng không hiểu? Hãy hỏi{' '}
                <a href='https://www.facebook.com/groups/163215593699283/'>
                  ở đây
                </a>
                .
              </p>
              <p>
                Ở trang chủ này, các bài viết về thuật toán được đánh dấu về độ
                khó từ (1*) đến (5*) với ý nghĩa:
              </p>
              <ul>
                <li>(1*): Cơ bản,</li>
                <li>(2*): Kiến thức cần biết để thi HSG QG, ACM ICPC,</li>
                <li>
                  (3*): Kiến thức nâng cao, dành cho các bạn có mục tiêu đạt
                  giải cao trong HSG QG,
                </li>
                <li>(4*): Kiến thức rất khó,</li>
                <li>
                  (5*): Kiến thức rất chuyên sâu về 1 vấn đề nào đó, chỉ áp dụng
                  được với rất ít bài khó.
                </li>
              </ul>
              <p>
                Hiện tại bọn mình chưa có bài viết về chủ đề Lý thuyết đồ thị,
                do phần này những quyển sách như sách thầy Lê Minh Hoàng, Tài
                liệu giáo khoa chuyên tin (download ở{' '}
                <Link className='link' to='Tai-Lieu-Thuat-Toan'>
                  Một số tài liệu hay về Thuật Toán
                </Link>
                ) đã viết rất chi tiết.
              </p>
              <h1 className='editable'>
                <a className='anchor' id='thuật-toán' href='#thuật-toán'></a>
                Thuật toán
              </h1>
              <h2 className='editable'>
                <a className='anchor' id='nhập-môn' href='#nhập-môn'></a>Nhập
                môn
              </h2>
              <ul>
                <li>
                  <Link className='link' to='The-Importance-of-Algorithm'>
                    Tầm quan trọng của Thuật Toán
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Tai-Lieu-Thuat-Toan'>
                    Một số tài liệu hay về Thuật Toán
                  </Link>
                </li>
                <li>
                  <Link className='link' to='How-to-Find-a-Solution'>
                    Nghệ thuật giải bài
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Planning-an-Approach-to-a-Topcoder-Problem-Part-1'
                  >
                    Những cách tiếp cận bài toán
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Computational-Complexity-Section-1'
                  >
                    Độ phức tạp tính toán (1*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='sorting'>
                    Sắp xếp (1*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='binary-search'>
                    Tìm kiếm nhị phân
                  </Link>
                </li>
                <li>
                  <Link className='link' to='two-pointers'>
                    Hai con trỏ (1*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='cấu-trúc-dữ-liệu'
                  href='#cấu-trúc-dữ-liệu'
                ></a>
                Cấu trúc dữ liệu
              </h2>
              <ul>
                <li>
                  <Link className='link' to='/lesson/data-structures-overview'>
                    Tổng quan về cấu trúc dữ liệu (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='array-vs-linked-lists'>
                    Mảng và danh sách liên kết (1*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Stack'>
                    Ngăn xếp (stack) (1*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='prefix-sum-and-difference-array'>
                    Mảng cộng dồn và mảng hiệu
                  </Link>
                </li>
                <li>
                  <Link className='link' to='deque-min-max'>
                    Deque và tìm min max trên đoạn tịnh tiến (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Binary-Heap'>
                    Heap (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='hash-table'>
                    Bảng băm (Hash table) (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='disjoint-set-union'>
                    Disjoint Set Union (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='segment-tree-basic'>
                    Cây Phân Đoạn (cơ bản)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='segment-tree-extend'>
                    Segment Tree (Interval Tree) (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Efficient-and-easy-segment-trees'>
                    Cài đặt Segment Tree chạy nhanh hơn (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='sqrt-decomposition'>
                    Chia căn - Part 1
                  </Link>
                </li>
                <li>
                  <Link className='link' to='mo-algorithm'>
                    Mo Algorithm (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='interval-tree-tap-doan-thang'>
                    Segment Tree (Interval Tree) trên tập đoạn thẳng (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='fenwick'>
                    Fenwick Tree (Binary Indexed Tree) (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='heavy-light-decomposition'>
                    Heavy Light Decomposition (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='persistent-data-structures'>
                    Persistent Data Structures (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='lca-binlift'>
                    Lowest Common Ancestor (LCA) - Binary Lifting
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Range-Minimum-Query-and-Lowest-Common-Ancestor'
                  >
                    Bài toán RMQ &amp; bài toán LCA (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='lca'>
                    Các phương pháp giải bài toán LCA (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='trie'>
                    Trie (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='suffix-array'>
                    Suffix Array (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='palindrome-tree'>
                    Palindrome Tree (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Skip-Lists'>
                    Skip List (3*)
                  </Link>
                </li>
                <li>
                  <a href='https://drive.google.com/file/d/0BwcTB8a10LBwbjB2elVmdzg1XzQ/view?usp=sharing&amp;resourcekey=0-JxqVgB488l3bVgUXg4VU2Q'>
                    Range Tree - thầy Lê Minh Hoàng (3*)
                  </a>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='xử-lý-xâu' href='#xử-lý-xâu'></a>Xử lý
                xâu
              </h2>
              <ul>
                <li>
                  <Link className='link' to='basic'>
                    Tổng quan (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='kmp'>
                    KMP (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='trie'>
                    Trie (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='hash'>
                    Hash (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='suffix-array'>
                    Suffix Array (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='palindrome-tree'>
                    Palindrome Tree (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='z-algo'>
                    Z-function
                  </Link>
                </li>
                <li>
                  <Link className='link' to='z-algo'>
                    Z Algorithm (3*)
                  </Link>
                </li>
                <li>
                  <a href='https://drive.google.com/file/d/0BwcTB8a10LBwYUwwNVYzbmZiZnM/view?usp=sharing&amp;resourcekey=0-TyQK7KSoZJW-fVpHquw6NQ'>
                    Suffix Tree - thầy Lê Minh Hoàng(4*)
                  </a>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='quy-hoạch-động'
                  href='#quy-hoạch-động'
                ></a>
                Quy hoạch động
              </h2>
              <ul>
                <li>
                  <Link className='link' to='dynamic-programming'>
                    Nhập môn Quy hoạch động (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='basic-dynamic-programming-1'>
                    Quy hoạch động cơ bản (Phần 1)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='basic-dynamic-programming-2'>
                    Quy hoạch động cơ bản (Phần 2)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='palindrome-problems'>
                    Một vài bài tập về Palindrome (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='basic-problems'>
                    Một số bài toán QHD điển hình (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='thac-mac-ve-qhd'>
                    Phân tích về QHD - Thầy Lê Minh Hoàng
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Mot-so-ky-thuat-toi-uu-hoa-thuat-toan-Quy-Hoach-Dong'
                  >
                    Một số kĩ thuật tối ưu hoá QHĐ (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Convex-Hull-Trick'>
                    Kĩ thuật bao lồi (3*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='đồ-thị' href='#đồ-thị'></a>Đồ thị
              </h2>
              <ul>
                <li>
                  <Link className='link' to='everything'>
                    Các chủ đề cơ bản về đồ thị (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='breadth-first-search'>
                    Thuật toán duyệt đồ thị theo chiều rộng
                  </Link>{' '}
                  (BFS)
                </li>
                <li>
                  <Link className='link' to='Depth-First-Search-Tree'>
                    Bài toán khớp cầu, thành phần liên thông mạnh
                  </Link>{' '}
                  (Cây DFS và ứng dụng)
                </li>
                <li>
                  <Link className='link' to='minimum-spanning-tree'>
                    Cây khung nhỏ nhất trên đồ thị vô hướng
                  </Link>
                </li>
                <li>
                  <Link className='link' to='shortest-path'>
                    Các thuật toán về tìm đường đi ngắn nhất
                  </Link>
                </li>
                <li>
                  <Link className='link' to='topological-sort'>
                    Sắp xếp Tô-pô
                  </Link>
                </li>
                <li>
                  <Link className='link' to='euler-cycle'>
                    Đường đi - Chu trình Euler
                  </Link>
                </li>
                <li>
                  <Link className='link' to='euler-tour-on-tree'>
                    Đường đi Euler trên cây
                  </Link>
                </li>
                <li>
                  <Link className='link' to='centroid-decomposition'>
                    Thuật toán phân tách trọng tâm
                  </Link>
                </li>
                <li>
                  <a href='https://drive.google.com/file/d/15UbO4GWo1G6cUBDnV6uWk0KxjuEdurCG/view?usp=sharing'>
                    Bài toán 2-SAT (3*)
                  </a>
                </li>
                <li>
                  <Link
                    className='link'
                    to='max-flow-1-luong-cuc-dai-tren-mang-1'
                  >
                    Luồng cực đại trên mạng (3*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='tham-lam' href='#tham-lam'></a>Tham
                lam
              </h2>
              <ul>
                <li>
                  <Link className='link' to='Greedy-is-Good'>
                    Tham lam (2*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='số-học' href='#số-học'></a>Số học
              </h2>
              <ul>
                <li>
                  <Link className='link' to='So-hoc-Phan-1-Modulo-gcd'>
                    Số học 1 - Modulo và gcd (1*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-2'>
                    Số học 2 - Số nguyên tố, Sàng Eratosthenes (1*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-3'>
                    Số học 3 - Tính (a^b) % c (1*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-4'>
                    Số học 4 - Phi hàm Euler (2*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='modular-inverse'>
                    Số học 4.5 - Nghịch đảo modulo (2*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-5'>
                    Số học 5 - Các kiến thức cơ bản về Tổ hợp (Combinatorics)
                    (2*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-6'>
                    Số học 6 - Xác suất (Probabilities) (2*)
                  </Link>
                  .
                </li>
                <li>
                  <Link className='link' to='Number-Theory-7'>
                    Số học 7 - Bao hàm - Loại trừ (Inclusion-Exclusion) (2*)
                  </Link>
                  .
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='hình-học' href='#hình-học'></a>Hình
                học
              </h2>
              <ul>
                <li>
                  <Link className='link' to='basic-geometry-1'>
                    Hình học tính toán phần 1
                  </Link>
                </li>
                <li>
                  <Link className='link' to='basic-geometry-2'>
                    Hình học tính toán phần 2
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Sweep-Line'>
                    Thuật toán đường quét (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Convex-Hull'>
                    Bao lồi (3*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='toán-học' href='#toán-học'></a>Toán
                học
              </h2>
              <ul>
                <li>
                  <Link className='link' to='Mathematics-for-Topcoders'>
                    Toán học trong Tin học (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Hieu-ve-xac-suat'>
                    Xác suất (2*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Wilsons-theorem'>
                    Định lý Wilson (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='multiplicative-function'>
                    Hàm nhân tính (Multiplicative Function) (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='mobius-function'>
                    Hàm Mobius (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='FFT'>
                    Nhân nhanh đa thức - FFT (4*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='game-theory'>
                    Lý thuyết trò chơi
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='tối-ưu-hoá' href='#tối-ưu-hoá'></a>Tối
                ưu hoá
              </h2>
              <ul>
                <li>
                  <Link className='link' to='Tim-kiem-tam-phan-Ternary-Search'>
                    Tìm kiếm tam phân - Ternary Search (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Local-Search'>
                    Local Search (3*)
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='kỹ-năng-khác'
                  href='#kỹ-năng-khác'
                ></a>
                Kỹ năng khác
              </h2>
              <ul>
                <li>
                  <Link className='link' to='Roi-rac-hoa-va-ung-dung'>
                    Rời rạc hoá (nén số) (1*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='matrix-multiplication'>
                    Nhân ma trận (3*)
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='counting-without-matrix-multiplication'
                  >
                    Khử nhân ma trận (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='mo-algorithm'>
                    Mo's algorithm (3*)
                  </Link>
                </li>
                <li>
                  <Link className='link' to='fun-with-bits'>
                    Fun with bits
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Giai-Thuat-Cat-Tia-Alpha-beta'>
                    Giải thuật cắt tỉa Alpha-Beta
                  </Link>
                </li>
              </ul>
              <h1 className='editable'>
                <a className='anchor' id='chia-sẻ' href='#chia-sẻ'></a>Chia sẻ
              </h1>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='về-cách-học-tin-học'
                  href='#về-cách-học-tin-học'
                ></a>
                Về cách học Tin học
              </h2>
              <ul>
                <li>
                  <Link className='link' to='hoc-tin-the-nao-1'>
                    Tôi đã học Tin như thế nào - phần 1
                  </Link>
                </li>
                <li>
                  <Link className='link' to='hoc-tin-the-nao-2'>
                    Tôi đã học Tin như thế nào - phần 2
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='kĩ-năng-thi-cử'
                  href='#kĩ-năng-thi-cử'
                ></a>
                Kĩ năng thi cử
              </h2>
              <ul>
                <li>
                  <Link className='link' to='viet-trinh-cham'>
                    Viết trình chấm
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Ki-nang-thi-cu'>
                    Tổng hợp lời khuyên cho các kỳ thi
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Kinh-nghiem-thi-VOI'>
                    Kinh nghiệm thi VOI
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='kinh-nghiệm-phỏng-vấn'
                  href='#kinh-nghiệm-phỏng-vấn'
                ></a>
                Kinh nghiệm phỏng vấn
              </h2>
              <ul>
                <li>
                  <Link className='link' to='general-experience'>
                    Những kinh nghiệm chung khi phỏng vấn
                  </Link>
                </li>
                <li>
                  <Link className='link' to='experience-from-interviewer'>
                    Kinh nghiệm phỏng vấn - Góc nhìn từ người phỏng vấn
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Nhung-lan-phong-van-trong-thuc-te-va-bai-hoc-rut-ra'
                  >
                    Những lần phỏng vấn và những kinh nghiệm rút ra
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='vnoi-interview'
                  href='#vnoi-interview'
                ></a>
                VNOI Interview
              </h2>
              <ul>
                <li>
                  <Link className='link' to='yen-thanh'>
                    Phỏng vấn Lê Yên Thanh
                  </Link>
                </li>
                <li>
                  <Link className='link' to='xuan-khanh'>
                    Phỏng vấn Nguyễn Xuân Khánh
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Phong-van-team-IOI-VN-2017'>
                    Phỏng vấn Team IOI Việt Nam 2017
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Phong-van-team-IOI-Viet-Nam-2018'>
                    Phỏng vấn Team IOI Việt Nam 2018
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a className='anchor' id='khác' href='#khác'></a>Khác
              </h2>
              <ul>
                <li>
                  <Link className='link' to='Pascal-Vi-sao'>
                    Hoài niệm về Pascal - thầy Lê Minh Hoàng
                  </Link>
                </li>
              </ul>
              <h1 className='editable'>
                <a className='anchor' id='các-kỳ-thi' href='#các-kỳ-thi'></a>Các
                kỳ thi
              </h1>
              <ul>
                <li>
                  <a href='http://acmicpc-vietnam.github.io/'>
                    ACM ICPC Regional Vietnam
                  </a>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Cac-doi-Viet-Nam-tai-ACM-ICPC-World-Final'
                  >
                    Việt Nam tại ACM ICPC World Final
                  </Link>
                </li>
              </ul>
              <h1 className='editable'>
                <a
                  className='anchor'
                  id='các-chủ-đề-trong-khoa-học-máy-tính'
                  href='#các-chủ-đề-trong-khoa-học-máy-tính'
                ></a>
                Các chủ đề trong Khoa học máy tính
              </h1>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='ngôn-ngữ-lập-trình'
                  href='#ngôn-ngữ-lập-trình'
                ></a>
                Ngôn ngữ lập trình
              </h2>
              <ul>
                <li>
                  <Link className='link' to='string'>
                    Xử lý xâu trong C++
                  </Link>
                </li>
                <li>
                  <Link className='link' to='Using-Regular-Expression'>
                    Sử dụng regex
                  </Link>
                </li>
                <li>
                  <a href='https://drive.google.com/file/d/1iqlQ1TmgGy_CKwZ0_9KPfu_ZHsnrT3Tu/view?usp=sharing'>
                    C++ STL
                  </a>
                </li>
                <li>
                  <Link className='link' to='pointers'>
                    Con trỏ trong C++
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='machine-learning'
                  href='#machine-learning'
                ></a>
                Machine Learning
              </h2>
              <ul>
                <li>
                  <Link className='link' to='machine-learning-101'>
                    Machine Learning 101: Làm quen
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Machine-Learning-Classification-phan-1'
                  >
                    Classification - Phần 1
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Machine-Learning-Classification-phan-2'
                  >
                    Classification - Phần 2
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Machine-Learning-Classification-phan-3'
                  >
                    Classification - Phần 3
                  </Link>
                </li>
                <li>
                  <Link
                    className='link'
                    to='Machine-Learning-Classification-phan-3'
                  >
                    Classification - Phần 3
                  </Link>
                </li>
                <li>
                  <Link className='link' to='PyTorch-la-gi'>
                    PyTorch là gì?
                  </Link>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='các-chủ-đề-khác'
                  href='#các-chủ-đề-khác'
                ></a>
                Các chủ đề khác:
              </h2>
              <ul>
                <li>
                  Xử lý ảnh
                  <ul>
                    <li>
                      <Link className='link' to='Seam-Carving'>
                        Seam Carving
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  Cryptography
                  <ul>
                    <li>
                      <Link className='link' to='Public-Key-Cryptography'>
                        Public Key Cryptography và RSA
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href='https://v0.vnoi.info'>
                    Trang Web VNOI phiên bản đầu tiên
                  </a>
                </li>
                <li>
                  <a href='https://v0.vnoi.info/ioicamp'>
                    Trang Web IOICAMP phiên bản đầu tiên
                  </a>
                </li>
              </ul>
              <h2 className='editable'>
                <a
                  className='anchor'
                  id='trò-chơi-giải-trí-với-ai-hay'
                  href='#trò-chơi-giải-trí-với-ai-hay'
                ></a>
                <a href='https://play.google.com/store/apps/dev?id=8454869713871668206'>
                  Trò chơi giải trí với AI hay
                </a>
              </h2>
              <ul>
                <li>
                  <a href='http://play.google.com/store/apps/details?id=com.popoko.gomokuvn'>
                    Cờ Carô với AI hay
                  </a>
                </li>
                <li>
                  <a href='http://play.google.com/store/apps/details?id=com.popoko.chessru'>
                    Cờ Vua với AI hay
                  </a>
                </li>
                <li>
                  <a href='http://play.google.com/store/apps/details?id=com.popoko.gomokukr'>
                    Cờ Gomoku với AI hay
                  </a>
                </li>
                <li>
                  <a href='http://play.google.com/store/apps/details?id=com.popoko.minesweeper'>
                    Trò chơi Dò Mìn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
