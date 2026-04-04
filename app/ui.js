export function renderDashboard(){

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]")

  let totalMoney = 0
  sessions.forEach(s => totalMoney += s.total)

  document.getElementById("app").innerHTML = `
  <div class="wrapper">

    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item">
          <span class="nav-link">Trang chủ</span>
        </li>
      </ul>
    </nav>

    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <a class="brand-link">
        <span class="brand-text font-weight-light">Admin Panel</span>
      </a>

      <div class="sidebar">
        <nav>
          <ul class="nav nav-pills nav-sidebar flex-column">
            <li class="nav-item">
              <a class="nav-link active">
                <i class="nav-icon fas fa-chart-pie"></i>
                <p>Dashboard</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <div class="content-wrapper p-3">

      <div class="row">

        <div class="col-lg-3 col-6">
          <div class="small-box bg-info">
            <div class="inner">
              <h3>${sessions.length}</h3>
              <p>Tổng phiên</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-6">
          <div class="small-box bg-success">
            <div class="inner">
              <h3>${totalMoney.toLocaleString()}</h3>
              <p>Tổng tiền</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
  `
}