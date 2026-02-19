package com.banking.cif.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = { "/", "/{path:[^\\\\.]*}", "/**/{path:[^\\\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}