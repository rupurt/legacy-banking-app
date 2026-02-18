{
  description = "Legacy Banking CIF Application Dev Shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.openjdk8
            pkgs.maven
            pkgs.just
            pkgs.direnv
          ];

          JAVA_HOME="${pkgs.openjdk8.home}";

          shellHook = ''
            export PATH="$JAVA_HOME/bin:$PATH"
          '';
        };
      }
    );
}
